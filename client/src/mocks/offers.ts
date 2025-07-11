import { FullOffer } from "../types/post";

const offers: FullOffer[] = [
    {
        'id': '0f8f14ec-5efe-4bdf-bba7-5a45e6f14e99',
        'title': 'Modern Loft in the Heart of Paris',
        'description': 'A stylish loft apartment with stunning views of the Eiffel Tower and close proximity to cafés and museums.',
        'type': 'apartment',
        'price': 370,
        'images': [
            'apartment1_1.jpg',
            'apartment1_2.jpg',
            'apartment1_3.jpg',
            'apartment1_4.jpg',
        ],
        'city': {
            'name': 'Paris',
            'location': {
                'latitude': 48.85661,
                'longitude': 2.351499,
                'zoom': 13
            }
        },
        'location': {
            'latitude': 48.86861,
            'longitude': 2.342499,
            'zoom': 16
        },
        'goods': [
            'Breakfast',
            'Fridge',
            'Towels',
            'Washer'
        ],
        'host': {
            'isPro': true,
            'name': 'Angelina',
            'avatarUrl': 'avatar-angelina.jpg'
        },
        'isFavorite': true,
        'isPremium': false,
        'rating': 4.9,
        'bedrooms': 2,
        'maxAdults': 3
    },
    {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "title": "Charming Canal House in Amsterdam",
        "description": "Beautiful historic house overlooking the canals with modern amenities and bike rental nearby.",
        "type": "house",
        "price": 420,
        "images": [
            'apartment2_1.jpg',
            'apartment2_2.jpg',
            'apartment2_3.jpg',
            'apartment2_4.jpg'
        ],
        "city": {
            "name": "Amsterdam",
            "location": {
                "latitude": 52.370216,
                "longitude": 4.895168,
                "zoom": 13
            }
        },
        "location": {
            "latitude": 52.372216,
            "longitude": 4.893168,
            "zoom": 16
        },
        "goods": [
            "Breakfast",
            "Laptop friendly workspace",
            "Washer",
            "Towels"
        ],
        "host": {
            "isPro": true,
            "name": "Evgenia",
            "avatarUrl": "avatar-angelina.jpg"
        },
        "isFavorite": false,
        "isPremium": true,
        "rating": 4.8,
        "bedrooms": 3,
        "maxAdults": 4
    },
    {
        "id": "b2c3d4e5-f6a7-8901-bcde-f23456789012",
        "title": "Cozy Apartment Near Cologne Cathedral",
        "description": "Modern apartment just steps away from the famous cathedral with great city views.",
        "type": "apartment",
        "price": 290,
        "images": [
            'apartment3_1.jpg',
            'apartment3_2.jpg',
            'apartment3_3.jpg',
        ],
        "city": {
            "name": "Cologne",
            "location": {
                "latitude": 50.937531,
                "longitude": 6.960279,
                "zoom": 13
            }
        },
        "location": {
            "latitude": 50.939531,
            "longitude": 6.958279,
            "zoom": 16
        },
        "goods": [
            "Air conditioning",
            "Fridge",
            "Baby seat",
            "Towels"
        ],
        "host": {
            "isPro": false,
            "name": "Klaus",
            "avatarUrl": "avatar-max.jpg"
        },
        "isFavorite": true,
        "isPremium": false,
        "rating": 4.5,
        "bedrooms": 1,
        "maxAdults": 2
    },
    {
        "id": "c3d4e5f6-a7b8-9012-cdef-345678901234",
        "title": "Luxury Hotel Room in Dusseldorf",
        "description": "Elegant hotel room in the city center with premium services and spa access included.",
        "type": "hotel",
        "price": 380,
        "images": [
            'apartment4_1.jpg',
            'apartment4_2.jpg',
            'apartment4_3.jpg',
            'apartment4_4.jpg',
        ],
        "city": {
            "name": "Dusseldorf",
            "location": {
                "latitude": 51.227741,
                "longitude": 6.773456,
                "zoom": 13
            }
        },
        "location": {
            "latitude": 51.229741,
            "longitude": 6.771456,
            "zoom": 16
        },
        "goods": [
            "Breakfast",
            "Air conditioning",
            "Towels",
            "Laptop friendly workspace"
        ],
        "host": {
            "isPro": false,
            "name": "Max",
            "avatarUrl": "avatar-max.jpg"
        },
        "isFavorite": true,
        "isPremium": true,
        "rating": 4.9,
        "bedrooms": 1,
        "maxAdults": 2
    }
]

export { offers };