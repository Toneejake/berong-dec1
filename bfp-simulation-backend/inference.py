import torch
from PIL import Image
from torchvision import transforms
import numpy as np

def create_grid_from_image(model, image_path, image_size, device):
    """
    Takes a trained U-Net model and an image file path,
    and returns a binary numpy grid (1=wall, 0=free).
    """
    # Load and prepare the model
    model.to(device)
    model.eval()

    # Define the same transformations used during training
    transform = transforms.Compose([
        transforms.Resize((image_size, image_size)),
        transforms.ToTensor(),
    ])

    # Load and transform the input image
    try:
        image = Image.open(image_path).convert("RGB")
        input_tensor = transform(image).unsqueeze(0).to(device)
    except Exception as e:
        print(f"Error opening or processing image: {e}")
        return None

    # Get the model prediction
    with torch.no_grad():
        output = model(input_tensor)

    # Process the output into a binary grid
    # Apply sigmoid because our model outputs logits
    output_probs = torch.sigmoid(output)
    # Use a 0.5 threshold to decide wall vs. free space
    binary_mask = (output_probs > 0.5).float()

    # Squeeze the tensor to remove batch and channel dimensions, move to CPU
    grid_tensor = binary_mask.squeeze().cpu()

    # Convert to NumPy array
    grid_numpy = grid_tensor.numpy()
    
    # INVERT THE MASK:
    # U-Net typically outputs 1 for bright pixels (white areas in floor plans)
    # Floor plans: white/bright = walls, colored/dark = rooms (free space)
    # Simulation expects: 1 = walls (blocked), 0 = free space
    # So we INVERT: model output 1 (bright) -> keep as 1 (wall) ✓
    # But if rooms are being treated as walls, the model learned backwards
    # So we invert: 1 -> 0 (free), 0 -> 1 (wall)
    grid_numpy = 1 - grid_numpy
    
    return grid_numpy
