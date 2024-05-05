# Stop all containers
echo "Stop all containers"
docker stop `docker ps -qa`
echo "==================="

# Remove all containers
echo "Remove all containers"
docker rm `docker ps -qa`
echo "==================="

# Remove all images
echo "REMOVE ALL IMAGES"
docker rmi `docker images -qa`
echo "==================="

# Remove all volumes
echo "Remove all volumes"
docker volume rm $(docker volume ls -q)
echo "==================="

# Remove all networks
echo "Remove all networks"
docker network rm `docker network ls -q`
echo "==================="

# Your installation should now be all fresh and clean.

# The following commands should not output any items:
echo "\nThe following commands should not output any items:\n"
docker ps -a
docker images -a 
docker volume ls
echo "===================\n"

# The following command should only show the default networks:
echo "\nThe following command should only show the default networks :\n"
docker network ls
echo "==================="
