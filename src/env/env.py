import os
from pydrive2.auth import GoogleAuth
from pydrive2.drive import GoogleDrive


ENV_FILE = '../server/.env'
FILE_NAME = '.env'

FOLDER_ID = '1ACWk1o1s2SZ_5LHgDSbnDQfhf7VNU3vw'

def pull_env():
    print('Pulling .env file from Google Drive...')
    
    fileList = drive.ListFile({'q': f"'{FOLDER_ID}' in parents and trashed=false"}).GetList()
    
    envFile = next((file for file in fileList if file['title'] == FILE_NAME), None)
    
    if envFile:
        envFile.GetContentFile(ENV_FILE)
        print('.env file pulled successfully!')
    else:
        print('.env file not found in Google Drive!')
        
def push_env():
    print("Pushing .env file to Google Drive...")
    
    file_list = drive.ListFile({'q': f"'{FOLDER_ID}' in parents and trashed=false"}).GetList()
    env_file = next((file for file in file_list if file['title'] == FILE_NAME), None)
    
    if env_file:
        env_file.SetContentFile(ENV_FILE)
        env_file.Upload()
    else:
        file_metadata = {'title': FILE_NAME, 'parents': [{'id': FOLDER_ID}]}
        env_file = drive.CreateFile(file_metadata)
        env_file.SetContentFile(ENV_FILE)
        env_file.Upload()
    
    print(".env file pushed successfully.")
    

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: python3 env.py {pull|push}")
        sys.exit(1)
        
    gauth = GoogleAuth()
    gauth.LocalWebserverAuth()
    drive = GoogleDrive(gauth)
    
    if sys.argv[1] == "pull":
        pull_env()
    elif sys.argv[1] == "push":
        push_env()
    else:
        print("Invalid argument. Use 'pull' or 'push'.")
        sys.exit(1)