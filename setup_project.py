import os
import subprocess
import sys
import platform

def print_step(message):
    print(f"\n{'='*50}\n🔹 {message}\n{'='*50}")

def run_command(command, cwd=None):
    try:
        print(f"Running: {command}")
        subprocess.check_call(command, shell=True, cwd=cwd)
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {command}")
        sys.exit(1)

def setup_backend():
    print_step("Setting up Backend (Python)")
    
    backend_dir = os.path.join(os.getcwd(), 'backend')
    
    # 1. Create Virtual Environment
    if not os.path.exists(os.path.join(backend_dir, 'venv')):
        print("Creating virtual environment...")
        run_command(f"{sys.executable} -m venv venv", cwd=backend_dir)
    else:
        print("Virtual environment already exists.")

    # 2. Install Requirements
    print("Installing dependencies...")
    
    # Determine activation script based on OS
    if platform.system() == "Windows":
        pip_cmd = os.path.join(backend_dir, "venv", "Scripts", "pip")
    else:
        pip_cmd = os.path.join(backend_dir, "venv", "bin", "pip")

    run_command(f'"{pip_cmd}" install -r requirements.txt', cwd=backend_dir)
    print("✅ Backend dependencies installed.")

def setup_frontend():
    print_step("Setting up Frontend (Node.js)")
    
    if not os.path.exists(os.path.join(os.getcwd(), 'package.json')):
        print("No package.json found in root. Skipping frontend setup.")
        return

    print("Installing npm packages...")
    run_command("npm install")
    print("✅ Frontend dependencies installed.")

def main():
    print_step("GeoGuardian Project Setup 🌍")
    
    setup_backend()
    setup_frontend()
    
    print_step("Setup Complete! 🚀")
    print("\nTo start the Backend:")
    print("  cd backend")
    print("  .\\venv\\Scripts\\activate  (Windows) or source venv/bin/activate (Mac/Linux)")
    print("  uvicorn app.main:app --reload")
    
    print("\nTo start the Frontend:")
    print("  npm run dev")

if __name__ == "__main__":
    main()
