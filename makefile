NAME = transcendance
COMPOSE_FILE = ./docker-compose.yml

all: build start

build:
	sudo docker-compose -f $(COMPOSE_FILE) build
	@echo "\n\ntranscendance is ready to be launched."

update:
	@docker cp ./static django:/static
	@docker cp ./templates django:/templates
	@docker cp ./pong django:/pong

start:
	sudo docker-compose -f $(COMPOSE_FILE) up -d
	@echo "\n\ntranscendance is now running."

stop:
	sudo docker-compose -f $(COMPOSE_FILE) stop

clean: stop
	sudo docker-compose -f $(COMPOSE_FILE) down -v

fclean: clean
	@if [ -n "$$(sudo docker ps -a -q)" ]; then sudo docker rm -f $$(sudo docker ps -a -q); fi
	@if [ -n "$$(sudo docker images -q)" ]; then sudo docker rmi -f $$(sudo docker images -q); fi
	@if [ -n "$$(sudo docker volume ls -q)" ]; then sudo docker volume prune -f; fi

re: fclean all