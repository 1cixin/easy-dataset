# rebuild.ps1
docker stop easy-dataset
docker rm easy-dataset
docker build -t easy-dataset .
docker run -d -p 1717:1717 --name easy-dataset easy-dataset
docker logs -f easy-dataset