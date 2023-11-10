docker-dev:
	docker compose -f docker-compose.dev.yaml up --build

docker-prod:
	docker compose -f docker-compose.yaml up --build

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

.PHONY: docker-dev docker-prod create run stop pods svc
