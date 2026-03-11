# GCP VM 배포 가이드

## VM 정보
- 이름: asan-library
- 외부 IP: 34.22.107.18
- OS: Debian 12 (Bookworm)
- 리전: asia-northeast3-c

---

## Step 1: Docker 설치 (최초 1회)

```
sudo rm -f /etc/apt/sources.list.d/docker.list
```

```
sudo apt-get update
```

```
sudo apt-get install -y ca-certificates curl gnupg
```

```
sudo install -m 0755 -d /etc/apt/keyrings
```

```
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

```
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

```
sudo sh -c 'echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian bookworm stable" > /etc/apt/sources.list.d/docker.list'
```

```
sudo apt-get update
```

```
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

```
sudo usermod -aG docker $USER
```

```
newgrp docker
```

---

## Step 2: 코드 가져오기

```
sudo mkdir -p /opt/smart-did
```

```
sudo chown $USER:$USER /opt/smart-did
```

```
cd /opt/smart-did
```

```
git clone https://github.com/Villion-inc/Smart-DID.git .
```

> Private 리포인 경우 GitHub 유저네임 + Personal Access Token 입력

---

## Step 3: .env 파일 생성

```
cat > /opt/smart-did/.env << 'EOF'
DATABASE_URL=file:./prod.db
JWT_SECRET=여기에시크릿키
INTERNAL_API_SECRET=여기에내부시크릿키
GEMINI_API_KEY=여기에제미니키
ALPAS_USE_MOCK=false
ALPAS_API_URL=여기에알파스URL
ALPAS_API_KEY=여기에알파스키
ADMIN_USERNAME=admin
ADMIN_PASSWORD=여기에비밀번호
NAVER_CLIENT_ID=여기에네이버ID
NAVER_CLIENT_SECRET=여기에네이버시크릿
EOF
```

---

## Step 4: 빌드 및 실행

```
cd /opt/smart-did
```

```
docker compose up -d --build
```

---

## 유용한 명령어

로그 확인:
```
cd /opt/smart-did && docker compose logs -f
```

특정 서비스 로그:
```
docker compose logs -f backend
```

```
docker compose logs -f worker
```

```
docker compose logs -f frontend
```

재시작:
```
cd /opt/smart-did && docker compose restart
```

중지:
```
cd /opt/smart-did && docker compose down
```

코드 업데이트 후 재배포:
```
cd /opt/smart-did && git pull && docker compose up -d --build
```
