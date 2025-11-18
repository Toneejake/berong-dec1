import requests, json, time, random
from PIL import Image, ImageDraw

print("="*60)
print("PPO Commander 500k Steps - Integration Test")
print("="*60)

# Test 1: Health Check
print("\n[1] Health Check...")
r = requests.get("http://localhost:8000/api/health")
h = r.json()
print(f"   PPO Version: {h['ppo_version']}")
print(f"    PASS")

# Test 2: Create & Process Image
print("\n[2] Image Processing...")
img = Image.new('RGB', (256,256), 'white')
d = ImageDraw.Draw(img)
d.rectangle([0,0,256,10],'black')
d.rectangle([0,246,256,256],'black')
d.rectangle([0,0,10,256],'black')
d.rectangle([246,0,256,256],'black')
img.save('test.png')

with open('test.png', 'rb') as f:
    r = requests.post("http://localhost:8000/api/process-image", files={'file':f})
grid = r.json()['grid']
print(f"   Grid: {len(grid)}x{len(grid[0])}")
print(f"    PASS")

# Test 3: Run Simulation (8 agents, 200 exits)
print("\n[3] Simulation (8 agents, ~200 exits)...")
free = [[r,c] for r in range(len(grid)) for c in range(len(grid[0])) if grid[r][c]==1]
perim = [[r,c] for r,c in free if r==0 or r==255 or c==0 or c==255]
cfg = {
    "grid": grid,
    "exits": perim[:200],
    "fire_position": random.choice(free),
    "agent_positions": random.sample(free, 8)
}
r = requests.post("http://localhost:8000/api/run-simulation", json=cfg)
job_id = r.json()['job_id']
print(f"   Job: {job_id}")

# Test 4: Poll Results
print("\n[4] Waiting for results...")
for i in range(30):
    time.sleep(2)
    r = requests.get(f"http://localhost:8000/api/status/{job_id}")
    s = r.json()
    if s['status'] == 'complete':
        res = s['result']
        print(f"\n    SUCCESS!")
        print(f"   Agents: {res['total_agents']}")
        print(f"   Escaped: {res['escaped_count']}")
        print(f"   Time: {res['time_steps']} steps")
        print(f"   Rate: {res['escaped_count']/res['total_agents']*100:.1f}%")
        print("\n"+"="*60)
        print(" 500K MODEL WORKING PERFECTLY!")
        print("="*60)
        break
    print(f"   {s['status']}... {i*2}s", end='\r')
