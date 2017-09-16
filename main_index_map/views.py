from django.http import JsonResponse
from django.conf import settings
from django.shortcuts import render
from .models import GeoLocation
from . import fw


def index(request):
    """ View for the home of the project
    :param request:
    """
    # Returning rows from fusion table
    addresses = fw.get_all_addresses()

    context = {
        'addresses': addresses,
        'GOOGLE_API_KEY': settings.GOOGLE_API_KEY
    }
    return render(request, 'index.html', context)


def add_address(request):
    """ Json view that add a new address both on local db and on a fusion table
    :param request:
    """
    lat = request.GET.get('lat', None)
    lng = request.GET.get('lng', None)
    address = request.GET.get('address', None)
    if lat and lng and address:
        location = GeoLocation.create(lat, lng, address)
        addresses = GeoLocation.objects.all()
        fusion_exists = fw.address_exist(lat, lng)
        # No duplicated allowed, neither locally nor remotely
        if location in addresses or fusion_exists:
            data = {'result': 'address already added'}
            return JsonResponse(data)

        fw.add_address(address.replace("'", "\\'"), lat, lng)
        location.save()
    data = {'result': 'ok'}
    return JsonResponse(data)


def remove_all_addresses(request):
    """ Json view that wipes all the addresses both locally and remotely
    :param request:
    """
    # Remove local addresses
    GeoLocation.objects.all().delete()
    # Remove remote addresses
    fw.remove_all_addresses()
    data = {'result': 'ok'}
    return JsonResponse(data)
