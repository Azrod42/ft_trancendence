all :
	docker-compose up
build :
	docker-compose up -build
cleandb:
	docker volume prune -a
clean : cleandb
fclean : clean
	docker system prune -a