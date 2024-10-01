# CI/CD Pipeline Documentation

## CI/CD Pipeline Steps
1. Build Stage
- build_client
- Navigates to the client directory.
- Builds a Docker image for the client with a tag based on the commit SHA and the latest tag.
- Logs into Docker Hub and pushes both the tagged and latest images.
- build_server
- Navigates to the server directory.
- Builds a Docker image for the server with a tag based on the commit SHA and the latest tag.
- Logs into Docker Hub and pushes both the tagged and latest images.
2. Test Stage
- test_client
- Pulls the client Docker image from Docker Hub and runs tests.
- test_server
- Pulls the server Docker image from Docker Hub and runs tests.
3. Deploy Stage
- deploy
- Uses Docker Compose to deploy the services. This step only runs on the master branch.
## Environment Variables
### GitLab CI/CD Variables
- DOCKER_USERNAME: Your Docker Hub username.
- DOCKER_PASSWORD: Your Docker Hub password.
These variables need to be set in the GitLab project under Settings -> CI/CD -> Variables.

## Running the Pipeline
### Trigger the Pipeline:

- The CI pipeline is triggered automatically when changes are pushed to the repository.
- The deploy stage only runs for changes pushed to the master branch.
### Monitor the Pipeline:

- Navigate to CI/CD -> Pipelines in your GitLab project.
- Monitor the stages and jobs to ensure they complete successfully.
### Troubleshooting
Build Failures:

- Ensure the Dockerfile syntax is correct and dependencies are properly defined.
- Check the logs for any specific error messages and address them accordingly.
### Test Failures:

- Ensure the tests are up-to-date and compatible with the current codebase.
- Check for any environmental issues that might be causing test failures.
### Deployment Issues:

- Verify that the Docker Compose file is correctly configured.
- Ensure that the Docker images are being correctly pulled from Docker Hub.
