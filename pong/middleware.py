from django_otp.middleware import OTPMiddleware
from django.http import HttpResponse

class Require2FAMiddleware(OTPMiddleware):
    def process_request(self, request):
        super().process_request(request)
        
        if request.user.is_authenticated and not request.user.otp_device:
            return HttpResponse('2FA required', status=401)


# from django.utils.deprecation import MiddlewareMixin

# class Require2FAMiddleware(MiddlewareMixin):
#     def process_request(self, request):
#         if request.user.is_authenticated and not request.user.is_verified():
#             # Redirect to a 2FA verification page
#             return redirect('2fa_verification_page')
