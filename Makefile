all :
	docker-compose up
build :
	docker-compose up -build
cleandb:
	docker volume prune -f
clean : cleandb
fclean : clean
	docker system prune -af