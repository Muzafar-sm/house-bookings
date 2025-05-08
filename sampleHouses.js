const houses = [
  {
    title: "Luxury Beachfront Villa",
    description: "Beautiful villa with direct beach access and stunning ocean views. Perfect for family vacations.",
    price: 350,
    location: {
      type: "Point",
      coordinates: [78.4867, 17.3850], // Hyderabad coordinates
      address: "123 Beach Road",
      city: "Hyderabad",
      state: "Telangana",
      zipCode: "500001"
    },
    bedrooms: 4,
    bathrooms: 3,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811"
    ],
    amenities: ["Pool", "WiFi", "Air Conditioning", "Kitchen", "Free Parking"],
    isAvailable: true
  },
  {
    title: "Modern City Apartment",
    description: "Stylish apartment in the heart of the city with amazing skyline views.",
    price: 150,
    location: {
      type: "Point",
      coordinates: [78.4761, 17.3755],
      address: "456 City Center",
      city: "Hyderabad",
      state: "Telangana",
      zipCode: "500002"
    },
    bedrooms: 2,
    bathrooms: 2,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
    ],
    amenities: ["WiFi", "Air Conditioning", "Gym", "Security"],
    isAvailable: true
  },
  {
    title: "Cozy Garden Cottage",
    description: "Charming cottage surrounded by beautiful gardens in a peaceful neighborhood.",
    price: 120,
    location: {
      type: "Point",
      coordinates: [78.4931, 17.3934],
      address: "789 Garden Lane",
      city: "Hyderabad",
      state: "Telangana",
      zipCode: "500003"
    },
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233",
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8"
    ],
    amenities: ["Garden", "WiFi", "Kitchen", "Parking"],
    isAvailable: true
  }
];

module.exports = houses;