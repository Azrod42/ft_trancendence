all :
	docker-compose up
build :
	docker-compose up -build
clean :
	docker system prune -a
fclean : clean