cupfy
=============

Cupfy is a simple platform to help developers get updated about bugs/news/any information regarding their software on their phones/laptops instantly.

##How it works

Cupfy allow users to create their own `namespaces` so themselves and testers can listen to it. Everytime they want to send an important information to all devices listening the namespace, it can be done with a single `POST` request.

```bash
curl "https://cupfy.com/device/push"
-d title="Sample title"
-d message="Sample message"
-d namespace="com.example.hook"
-d apiSecret="Sample apiSecret"
-X POST
```

Yes, is that simple :)
