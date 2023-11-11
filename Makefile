docker-dev:
	docker compose -f docker-compose.dev.yaml up --build

docker-dev-nobuild:
	docker compose -f docker-compose.dev.yaml up

docker-prod:
	docker compose -f docker-compose.yaml up --build

docker-prod-nobuild:
	docker compose -f docker-compose.yaml up

create:
	mkdir -p k8s
	kompose convert -f docker-compose.k8s.yaml -o k8s

run:
	kubectl apply -f k8s

stop:
	kubectl delete all --all --namespace default

pods:
	kubectl get pods

svc:
	kubectl get svc

.PHONY: docker-dev docker-dev-nobuild docker-prod create run stop pods svc
