Here’s the updated README.md with GitHub Actions CI/CD integration details added:

md
Copy
Edit
# 🧠 New Relic APM Integration with Node.js on AWS ECS (Fargate)

This project demonstrates how to monitor a Node.js application deployed on AWS ECS using **New Relic APM**, with CI/CD pipeline using **GitHub Actions**, and key learnings highlighted for future reference.

---

## 🚀 What’s Included

- ✅ Node.js app instrumented with **New Relic APM agent**
- ✅ Containerized using **Docker**
- ✅ Deployed to **AWS ECS Fargate**
- ✅ **GitHub Actions** used for CI/CD
- ✅ Metrics visualized on **New Relic Dashboard**

---

## 🔁 GitHub Actions CI/CD Pipeline

The app is deployed to ECS via GitHub Actions. Key steps:

### 🛠 `.github/workflows/deploy.yml`

```yaml
name: Deploy to ECS

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Log in to Amazon ECR
        run: |
          aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <your-account-id>.dkr.ecr.us-east-1.amazonaws.com

      - name: Build and Push Docker image
        run: |
          docker build -t my-node-service .
          docker tag my-node-service:latest <your-account-id>.dkr.ecr.us-east-1.amazonaws.com/my-node-service:latest
          docker push <your-account-id>.dkr.ecr.us-east-1.amazonaws.com/my-node-service:latest

      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster my-cluster \
            --service my-node-service \
            --force-new-deployment
Make sure the required secrets are configured in your GitHub repo:

AWS_ACCESS_KEY_ID

AWS_SECRET_ACCESS_KEY

⚠️ Key Learnings & Fixes
1. 🔧 New Relic Agent Setup
Install:

bash
Copy
Edit
npm install newrelic
Place require('newrelic') at the first line of your main entry file:

js
Copy
Edit
require('newrelic');
const express = require('express');
Set these env variables:

env
Copy
Edit
NEW_RELIC_LICENSE_KEY=your_key
NEW_RELIC_APP_NAME=my-node-service
2. 🛑 “New Relic requires that you name this application!” Fix
✅ Fix this by ensuring:

NEW_RELIC_APP_NAME is defined in environment or

It is in newrelic.js config file

Also, don’t use import syntax with newrelic. Use require() only.

3. 📦 ECS Task Definition Pitfalls
Don’t blindly reuse ECS task definition files. Remove these keys:

taskDefinitionArn

revision

status

requiresAttributes

registeredAt

registeredBy

compatibilities

Use this command to fetch editable JSON:

bash
Copy
Edit
aws ecs describe-task-definition --task-definition task1:3 > taskdefinition.json
Then register with:

bash
Copy
Edit
aws ecs register-task-definition --cli-input-json file://taskdefinition.json
4. 🌐 Allow Outbound HTTPS Traffic (Critical)
New Relic agent requires outbound internet access on port 443.

✅ Ensure:

ECS service runs in a public subnet or private subnet with NAT

Security group allows outbound HTTPS

VPC route tables have route to internet/NAT

🧪 Testing Metrics in New Relic
Use these sample endpoints:

bash
Copy
Edit
curl http://<your-domain>/
curl http://<your-domain>/slow
curl http://<your-domain>/error
Simulate load:

bash
Copy
Edit
npx autocannon -c 20 -d 15 http://<your-domain>/
Track metrics on New Relic like:

🚀 Throughput

📉 Error Rate

⏱ Web Transaction Time

💡 Apdex Score

📊 Optional: Custom Dashboards
Create dashboards using NRQL like:

sql
Copy
Edit
SELECT count(*) FROM Transaction WHERE appName = 'my-node-service'
✅ Summary
This project helped me:

✅ Understand ECS deployment via GitHub Actions

✅ Learn New Relic agent setup in Docker

✅ Fix outbound traffic issues for monitoring

✅ Test metrics and dashboard data flow

✅ Avoid pitfalls in ECS task definition reuse

🔗 Docs Referenced:

https://docs.newrelic.com/docs/apm/

https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_RegisterTaskDefinition.html

https://docs.github.com/en/actions
