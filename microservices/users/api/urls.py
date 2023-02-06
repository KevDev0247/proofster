from django.urls import path
from django.contrib.auth.views import LoginView, LogoutView
from api.views import ProofsterRegisterView, ProofsterLoginView, ProofsterLogoutView

urlpatterns = [
    path('register', ProofsterRegisterView.as_view()),
    path('login', ProofsterLoginView.as_view()),
    path('logout', ProofsterLogoutView.as_view())
]