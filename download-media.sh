#!/usr/bin/env bash
# Downloads every photo into assets/img
cd "$(dirname "$0")"; mkdir -p assets/img
[ -s assets/img/hero-resort.jpg ] || curl -sL -o assets/img/hero-resort.jpg 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fm=jpg&fit=crop&w=1400&q=75' && echo hero-resort
[ -s assets/img/hero-hotel.jpg ] || curl -sL -o assets/img/hero-hotel.jpg 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fm=jpg&fit=crop&w=1000&q=75' && echo hero-hotel
[ -s assets/img/hero-restaurant.jpg ] || curl -sL -o assets/img/hero-restaurant.jpg 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fm=jpg&fit=crop&w=1000&q=75' && echo hero-restaurant
[ -s assets/img/hero-lobby.jpg ] || curl -sL -o assets/img/hero-lobby.jpg 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fm=jpg&fit=crop&w=1000&q=75' && echo hero-lobby
[ -s assets/img/intro-team.jpg ] || curl -sL -o assets/img/intro-team.jpg 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fm=jpg&fit=crop&w=1200&q=75' && echo intro-team
[ -s assets/img/rec-name.jpg ] || curl -sL -o assets/img/rec-name.jpg 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fm=jpg&fit=crop&w=1000&q=75' && echo rec-name
[ -s assets/img/rec-phone.jpg ] || curl -sL -o assets/img/rec-phone.jpg 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fm=jpg&fit=crop&w=1000&q=75' && echo rec-phone
[ -s assets/img/rec-location.jpg ] || curl -sL -o assets/img/rec-location.jpg 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fm=jpg&fit=crop&w=1000&q=75' && echo rec-location
[ -s assets/img/rec-website.jpg ] || curl -sL -o assets/img/rec-website.jpg 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fm=jpg&fit=crop&w=1000&q=75' && echo rec-website
[ -s assets/img/rec-category.jpg ] || curl -sL -o assets/img/rec-category.jpg 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fm=jpg&fit=crop&w=1000&q=75' && echo rec-category
[ -s assets/img/rec-more.jpg ] || curl -sL -o assets/img/rec-more.jpg 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fm=jpg&fit=crop&w=1000&q=75' && echo rec-more
[ -s assets/img/flip-hotel.jpg ] || curl -sL -o assets/img/flip-hotel.jpg 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fm=jpg&fit=crop&w=1200&q=75' && echo flip-hotel
[ -s assets/img/step-product.jpg ] || curl -sL -o assets/img/step-product.jpg 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fm=jpg&fit=crop&w=1100&q=75' && echo step-product
[ -s assets/img/step-market.jpg ] || curl -sL -o assets/img/step-market.jpg 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fm=jpg&fit=crop&w=1100&q=75' && echo step-market
[ -s assets/img/step-collect.jpg ] || curl -sL -o assets/img/step-collect.jpg 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fm=jpg&fit=crop&w=1100&q=75' && echo step-collect
[ -s assets/img/step-sell.jpg ] || curl -sL -o assets/img/step-sell.jpg 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fm=jpg&fit=crop&w=1100&q=75' && echo step-sell
[ -s assets/img/ind-linen.jpg ] || curl -sL -o assets/img/ind-linen.jpg 'https://images.unsplash.com/photo-1631049035182-249067d7618e?auto=format&fm=jpg&fit=crop&w=700&q=75' && echo ind-linen
[ -s assets/img/ind-kitchen.jpg ] || curl -sL -o assets/img/ind-kitchen.jpg 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fm=jpg&fit=crop&w=700&q=75' && echo ind-kitchen
[ -s assets/img/ind-housekeeping.jpg ] || curl -sL -o assets/img/ind-housekeeping.jpg 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fm=jpg&fit=crop&w=700&q=75' && echo ind-housekeeping
[ -s assets/img/ind-furniture.jpg ] || curl -sL -o assets/img/ind-furniture.jpg 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fm=jpg&fit=crop&w=700&q=75' && echo ind-furniture
[ -s assets/img/ind-toiletries.jpg ] || curl -sL -o assets/img/ind-toiletries.jpg 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fm=jpg&fit=crop&w=700&q=75' && echo ind-toiletries
[ -s assets/img/ind-food.jpg ] || curl -sL -o assets/img/ind-food.jpg 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fm=jpg&fit=crop&w=700&q=75' && echo ind-food
[ -s assets/img/ind-laundry.jpg ] || curl -sL -o assets/img/ind-laundry.jpg 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fm=jpg&fit=crop&w=700&q=75' && echo ind-laundry
[ -s assets/img/ind-cctv.jpg ] || curl -sL -o assets/img/ind-cctv.jpg 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fm=jpg&fit=crop&w=700&q=75' && echo ind-cctv
[ -s assets/img/ind-interior.jpg ] || curl -sL -o assets/img/ind-interior.jpg 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fm=jpg&fit=crop&w=700&q=75' && echo ind-interior
[ -s assets/img/ind-software.jpg ] || curl -sL -o assets/img/ind-software.jpg 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fm=jpg&fit=crop&w=700&q=75' && echo ind-software
[ -s assets/img/bey-warehouse.jpg ] || curl -sL -o assets/img/bey-warehouse.jpg 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fm=jpg&fit=crop&w=800&q=75' && echo bey-warehouse
[ -s assets/img/bey-hospital.jpg ] || curl -sL -o assets/img/bey-hospital.jpg 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fm=jpg&fit=crop&w=800&q=75' && echo bey-hospital
[ -s assets/img/bey-realestate.jpg ] || curl -sL -o assets/img/bey-realestate.jpg 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fm=jpg&fit=crop&w=800&q=75' && echo bey-realestate
[ -s assets/img/bey-factory.jpg ] || curl -sL -o assets/img/bey-factory.jpg 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fm=jpg&fit=crop&w=800&q=75' && echo bey-factory
[ -s assets/img/bey-office.jpg ] || curl -sL -o assets/img/bey-office.jpg 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fm=jpg&fit=crop&w=800&q=75' && echo bey-office
[ -s assets/img/cta-office.jpg ] || curl -sL -o assets/img/cta-office.jpg 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fm=jpg&fit=crop&w=1800&q=75' && echo cta-office
