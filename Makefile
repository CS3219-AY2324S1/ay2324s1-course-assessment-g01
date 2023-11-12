dev:
	docker compose -f docker-compose.dev.yaml up --build

dev-nobuild:
	docker compose -f docker-compose.dev.yaml up

prod:
	docker compose -f docker-compose.yaml up --build

prod-nobuild:
	docker compose -f docker-compose.yaml up

convert:
	mkdir -p k8s
	kompose convert -f docker-compose.k8s.yaml -o k8s

run:
	kubectl apply -f k8s

ingress:
	kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/baremetal/deploy.yaml
	sleep 20
	kubectl apply -f k8s/ingress.yaml
	kubectl port-forward --namespace=ingress-nginx service/ingress-nginx-controller 8080:80

stop:
	kubectl delete ing ingress
	kubectl delete all --all --namespace default
	kubectl delete all --all --namespace ingress-nginx

pods:
	kubectl get pods

svc:
	kubectl get svc

.PHONY: docker-dev docker-dev-nobuild docker-prod create run stop pods svc
