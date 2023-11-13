dev:
	docker compose -f docker-compose.dev.yaml up --build

dev-nobuild:
	docker compose -f docker-compose.dev.yaml up

prod:
	docker compose -f docker-compose.yaml up --build

prod-nobuild:
	docker compose -f docker-compose.yaml up

run:
	kubectl apply -f k8s

services:
	kubectl apply -f k8s/collab-ws-server.yaml,k8s/collaboration-service.yaml,k8s/frontend.yaml,k8s/history-service.yaml,k8s/matching-service.yaml,k8s/question-service.yaml,k8s/user-service.yaml

get-ingress:
	kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/baremetal/deploy.yaml
	sleep 20

ingress:
	kubectl apply -f k8s/ingress.yaml
	kubectl port-forward --namespace=ingress-nginx service/ingress-nginx-controller 8080:80

pipeline:
	make services
	make get-ingress
	make ingress

stop:
	kubectl delete ing ingress
	kubectl delete all --all --namespace default
	kubectl delete all --all --namespace ingress-nginx

pods:
	kubectl get pods

svc:
	kubectl get svc
