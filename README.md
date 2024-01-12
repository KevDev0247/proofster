# Proofster
A proof assistant platform automating preprocessing and normalization procedure before resolution proofs in the context of first order logic, drastically reduce human errors of doing calculation by hand.

Microservices Docker Images: https://hub.docker.com/u/kevdev0247 
<br /> (GKE Deployment no longer active! currently migrating from GKE Autopilot to Regular Cluster to save cost)

See the bottom section Gallery for UI/UX

## Tech stack
<strong>Frontend</strong>: Typescript (React, Redux Toolkit, Axios, MaterialUI, HTML, CSS)

<p align="left">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=ts,react,redux,materialui,heroku" />
  </a>
</p>

<strong>Microservices:</strong> Python (Django, PostgreSQL), Go (Gin, Goroutine, MongoDB), RabbitMQ, Docker, Kubernetes, GCP

<p align="left">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=python,django,postgres,go,mongodb,rabbitmq,docker,kubernetes,gcp" />
  </a>
</p>

<strong>Domain Layer</strong>: Vanilla Python (Recursive Algorithms, Binary Trees), AWS (Lambda, API Gateway)

<p align="left">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=python,aws" />
  </a>
</p>

## System Design
<img width="1821" alt="system" src="https://user-images.githubusercontent.com/58012125/229211362-8328f7b4-2818-4b51-b083-05d6417ec430.png">

## Data Structure (Sample Data Structure and UML Diagram)
<img width="2677" alt="datastructure" src="https://user-images.githubusercontent.com/58012125/229700951-155b2130-9150-4953-9aab-5bd805ef4b61.png">

## Algorithm Execution Workflow (Sequence Diagram)
<img width="3028" alt="sequence1" src="https://user-images.githubusercontent.com/58012125/229009145-72e6c6e5-e21e-47e4-8fb9-0ef0e72bfab5.png">

## Lifecycle of a Formula (Sequence Diagram)
<img width="2785" alt="sequence2" src="https://user-images.githubusercontent.com/58012125/229257634-575b99c5-24c7-4b90-bec7-eedf9380256f.png">

## Gallery
Editor & Control Panel

![md1](https://user-images.githubusercontent.com/58012125/229315386-c3ee064d-59da-4fcd-bba1-00408d28ebda.png)

Steps generation

![md2](https://user-images.githubusercontent.com/58012125/229315397-e7acccbf-1c27-4543-8b01-bfc23c0d7977.png)

Stages propagation reaches end

![md3](https://user-images.githubusercontent.com/58012125/229315401-507855bd-089f-4c96-be45-9030a70645e1.png)

Stats and dashboard

![33](https://user-images.githubusercontent.com/58012125/226516936-a997ea03-5692-4313-9bb0-9e841dac81cb.jpg)

Mobile Responsive Features

![55](https://user-images.githubusercontent.com/58012125/226523114-6f7905b9-bde1-4c33-8217-28e34297e807.jpg)
![66](https://user-images.githubusercontent.com/58012125/226524327-cff66f81-10ed-441a-8684-d65aa1a5a273.jpg)
![77](https://user-images.githubusercontent.com/58012125/226530368-ed1e7ab8-148b-4ced-a601-62119527369e.jpg)
![88](https://user-images.githubusercontent.com/58012125/226530376-822231c8-27f6-4efc-8e64-3d0b16302f26.jpg)
![99](https://user-images.githubusercontent.com/58012125/226524374-1519ade1-9560-4ce7-9eb5-b3caa24f5a50.jpg)
![111](https://user-images.githubusercontent.com/58012125/226524387-96320a94-ab4b-42c1-8b86-1943e09d5384.jpg)

## Getting Started

### Algorithm Service
Run
<pre>
go run main.go
</pre>
Inside `~/Projects/proofster/microservices/algorithm`

### Workspaces Service
Run
<pre>
poetry run python manage.py runserver 0.0.0.0:8001
</pre>
Inside `~/Projects/proofster/microservices/workspaces`

### Formulas Service
Run
<pre>
poetry run python manage.py runserver 0.0.0.0:8002
</pre>
Inside `~/Projects/proofster/microservices/formulas`

### Frontend
Run
<pre>
npm start 
</pre>
Inside `~/Projects/proofster/frontend`

## Trying it Out

### Infix
<pre>
 ∀x  ∃y  (  (  F(y)  ∧  G(y)  )  ∨  ¬  (  F(x)  ⇒  G(x)  )  )
 ∀x  (  F(x)  ⇒  ¬  (  H(x)  )  )
 ∀x  (  F(x)  ⇒  ¬  (  G(x)  )  )
 ∀x  (  ¬  (  F(x)  )  )
</pre>

### Postfix
<pre>
input FORM F y FORM G y AND FORM F x FORM G x -> OR EXIST y FORALL x
input FORM F x FORM H x NOT -> FORALL x
input FORM F x FORM G x NOT -> FORALL x
input FORM F x NOT FORALL x
</pre>

### Natural
<pre>
FORALL x EXIST y ( ( FORM F y AND FORM G y ) OR NOT ( FORM F x -> FORM G x ) )
FORALL x ( FORM F x -> NOT ( FORM H x ) )
FORALL x ( FORM F x -> NOT ( FORM G x ) )
FORALL x ( NOT ( FORM F x ) )
</pre>
