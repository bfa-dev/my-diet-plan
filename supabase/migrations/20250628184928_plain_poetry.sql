/*
  # Seed Recipe Data

  1. Insert sample recipes
    - Turkish and Mediterranean cuisine recipes
    - Complete nutrition information
    - Ingredients and instructions
*/

INSERT INTO recipes (
  id,
  title,
  description,
  cuisine_type,
  photo_url,
  prep_time_minutes,
  cook_time_minutes,
  calories,
  protein_grams,
  carbs_grams,
  fat_grams,
  ingredients,
  instructions
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Zeytinyağlı Enginar',
  'Taze enginarların zeytinyağında nefis bir şekilde pişirildiği Akdeniz usulü tarif. Vitamin ve mineral açısından zengin, sağlıklı bir ana yemek seçeneği.',
  'Turkish',
  'https://images.pexels.com/photos/8478108/pexels-photo-8478108.jpeg?auto=compress&cs=tinysrgb&w=800',
  20,
  45,
  180,
  4,
  15,
  12,
  '[
    {"ingredientName": "Enginar", "quantity": 4, "unit": "adet"},
    {"ingredientName": "Zeytinyağı", "quantity": 60, "unit": "ml"},
    {"ingredientName": "Soğan", "quantity": 1, "unit": "adet"},
    {"ingredientName": "Havuç", "quantity": 2, "unit": "adet"},
    {"ingredientName": "Limon", "quantity": 1, "unit": "adet"},
    {"ingredientName": "Dereotu", "quantity": 1, "unit": "demet"},
    {"ingredientName": "Tuz", "quantity": 1, "unit": "tsp"}
  ]',
  ARRAY[
    'Enginarları temizleyip limon suyuna batırın.',
    'Soğanı ince doğrayın, zeytinyağında kavurun.',
    'Havuçları dilimleri halinde ekleyin.',
    'Enginarları ekleyip su ile pişirin.',
    'Dereotu ve baharatları ekleyip servis yapın.'
  ]
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Menemen',
  'Domates, biber ve yumurtanın muhteşem uyumu. Türk kahvaltısının vazgeçilmez lezzeti, protein açısından zengin ve doyurucu bir kahvaltı seçeneği.',
  'Turkish',
  'https://images.pexels.com/photos/7218637/pexels-photo-7218637.jpeg?auto=compress&cs=tinysrgb&w=800',
  10,
  15,
  280,
  18,
  12,
  20,
  '[
    {"ingredientName": "Yumurta", "quantity": 3, "unit": "adet"},
    {"ingredientName": "Domates", "quantity": 2, "unit": "adet"},
    {"ingredientName": "Yeşil biber", "quantity": 1, "unit": "adet"},
    {"ingredientName": "Soğan", "quantity": 0.5, "unit": "adet"},
    {"ingredientName": "Zeytinyağı", "quantity": 30, "unit": "ml"},
    {"ingredientName": "Tuz", "quantity": 1, "unit": "tsp"},
    {"ingredientName": "Karabiber", "quantity": 0.5, "unit": "tsp"}
  ]',
  ARRAY[
    'Soğanı ince doğrayıp zeytinyağında kavurun.',
    'Biberi ekleyip yumuşatın.',
    'Domatesleri doğrayıp ekleyin, pişirin.',
    'Yumurtaları çırpıp tavaya ekleyin.',
    'Karıştırarak pişirin ve servis yapın.'
  ]
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Akdeniz Salatası',
  'Taze sebzeler ve zeytinyağının sağlıklı buluşması. Vitamin ve mineral açısından zengin, hafif ve besleyici bir öğle yemeği alternatifi.',
  'Mediterranean',
  'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=800',
  15,
  0,
  150,
  8,
  8,
  12,
  '[
    {"ingredientName": "Salatalık", "quantity": 1, "unit": "adet"},
    {"ingredientName": "Domates", "quantity": 2, "unit": "adet"},
    {"ingredientName": "Kırmızı soğan", "quantity": 0.5, "unit": "adet"},
    {"ingredientName": "Yeşil zeytin", "quantity": 50, "unit": "gram"},
    {"ingredientName": "Beyaz peynir", "quantity": 100, "unit": "gram"},
    {"ingredientName": "Zeytinyağı", "quantity": 45, "unit": "ml"},
    {"ingredientName": "Limon suyu", "quantity": 15, "unit": "ml"}
  ]',
  ARRAY[
    'Salatalık ve domatesleri doğrayın.',
    'Soğanı ince dilimleyin.',
    'Peyniri küpler halinde kesin.',
    'Tüm malzemeleri karıştırın.',
    'Zeytinyağı ve limon suyu ile tatlandırın.'
  ]
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  'Mercimek Çorbası',
  'Geleneksel Türk mutfağının vazgeçilmez çorbası. Protein ve lif açısından zengin, doyurucu ve besleyici bir ana yemek seçeneği.',
  'Turkish',
  'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=800',
  10,
  30,
  220,
  12,
  35,
  4,
  '[
    {"ingredientName": "Kırmızı mercimek", "quantity": 200, "unit": "gram"},
    {"ingredientName": "Soğan", "quantity": 1, "unit": "adet"},
    {"ingredientName": "Havuç", "quantity": 1, "unit": "adet"},
    {"ingredientName": "Patates", "quantity": 1, "unit": "adet"},
    {"ingredientName": "Su", "quantity": 1.5, "unit": "litre"},
    {"ingredientName": "Zeytinyağı", "quantity": 30, "unit": "ml"},
    {"ingredientName": "Tuz", "quantity": 1, "unit": "tsp"}
  ]',
  ARRAY[
    'Soğanı doğrayıp zeytinyağında kavurun.',
    'Havuç ve patates ekleyin.',
    'Mercimek ve suyu ekleyip kaynatın.',
    '25 dakika pişirin.',
    'Blender ile püre haline getirin ve servis yapın.'
  ]
),
(
  '550e8400-e29b-41d4-a716-446655440005',
  'Izgara Tavuk Salatası',
  'Protein açısından zengin, düşük kalorili ve doyurucu bir ana yemek. Kilo verme hedefi olanlar için ideal seçenek.',
  'Mediterranean',
  'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800',
  15,
  20,
  320,
  35,
  8,
  16,
  '[
    {"ingredientName": "Tavuk göğsü", "quantity": 200, "unit": "gram"},
    {"ingredientName": "Karışık yeşillik", "quantity": 100, "unit": "gram"},
    {"ingredientName": "Cherry domates", "quantity": 150, "unit": "gram"},
    {"ingredientName": "Avokado", "quantity": 0.5, "unit": "adet"},
    {"ingredientName": "Zeytinyağı", "quantity": 30, "unit": "ml"},
    {"ingredientName": "Limon suyu", "quantity": 20, "unit": "ml"},
    {"ingredientName": "Tuz", "quantity": 1, "unit": "tsp"},
    {"ingredientName": "Karabiber", "quantity": 0.5, "unit": "tsp"}
  ]',
  ARRAY[
    'Tavuk göğsünü baharatla marine edin.',
    'Izgara tavada pişirin.',
    'Yeşillikleri yıkayıp doğrayın.',
    'Domatesleri yarıya kesin.',
    'Avokadoyu dilimleyin.',
    'Tüm malzemeleri karıştırıp servis yapın.'
  ]
),
(
  '550e8400-e29b-41d4-a716-446655440006',
  'Yulaf Ezmeli Smoothie Bowl',
  'Besleyici ve doyurucu kahvaltı seçeneği. Lif, protein ve sağlıklı karbonhidrat açısından zengin.',
  'Mediterranean',
  'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800',
  10,
  0,
  350,
  15,
  45,
  12,
  '[
    {"ingredientName": "Yulaf ezmesi", "quantity": 50, "unit": "gram"},
    {"ingredientName": "Muz", "quantity": 1, "unit": "adet"},
    {"ingredientName": "Yaban mersini", "quantity": 80, "unit": "gram"},
    {"ingredientName": "Süt", "quantity": 200, "unit": "ml"},
    {"ingredientName": "Bal", "quantity": 15, "unit": "ml"},
    {"ingredientName": "Ceviz", "quantity": 20, "unit": "gram"},
    {"ingredientName": "Chia tohumu", "quantity": 10, "unit": "gram"}
  ]',
  ARRAY[
    'Yulaf ezmeyi sütle karıştırın.',
    'Muzun yarısını ezin, yarısını dilimleyin.',
    'Ezilmiş muzu karışıma ekleyin.',
    'Kaseye alın, üzerine meyveleri dizin.',
    'Ceviz ve chia tohumu ile süsleyin.'
  ]
);