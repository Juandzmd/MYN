-- Migration: Update products with correct MYN products
-- This script safely updates existing products

-- First, delete old products
DELETE FROM products;

-- Insert the 3 correct MYN products
INSERT INTO products (name, description, price, image_url, stock, category) VALUES
(
  'Kenya Nyeri Signature',
  'Café de origen único de Kenya con notas de caramelo, cítrico, floral y almendra. 250 gramos.',
  13500,
  'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
  50,
  'Kenya'
),
(
  'Perú Valle Chanchamayo',
  'Café peruano con cuerpo robusto y notas de chocolate, frutal y acidez baja. 250 gramos.',
  12000,
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
  75,
  'Perú'
),
(
  'Drip Coffee Individual (15g)',
  'Café de filtro individual portátil con filtro incorporado. Mezcla de orígenes. 15 gramos por unidad.',
  1500,
  'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
  100,
  'Mix Orígenes'
);
