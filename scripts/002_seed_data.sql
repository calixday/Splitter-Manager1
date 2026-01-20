-- Seed data for Team Ngaira splitter locations

-- Insert locations
INSERT INTO public.locations (id, name)
VALUES 
  ('550e8400-e29b-41d4-a716-000000000001'::uuid, 'Argwings kodhek-Elgeyo Marakwet'),
  ('550e8400-e29b-41d4-a716-000000000002'::uuid, 'Chaka-Tigoni'),
  ('550e8400-e29b-41d4-a716-000000000003'::uuid, 'Dennis pritt - Woodlands'),
  ('550e8400-e29b-41d4-a716-000000000004'::uuid, 'Dennis Pritt-Citizen (Cab 17)'),
  ('550e8400-e29b-41d4-a716-000000000005'::uuid, 'Dennis spritt-Nyangumi'),
  ('550e8400-e29b-41d4-a716-000000000006'::uuid, 'Dhanjay'),
  ('550e8400-e29b-41d4-a716-000000000007'::uuid, 'Githunguri'),
  ('550e8400-e29b-41d4-a716-000000000008'::uuid, 'Hendred Ave-White Knight Apt'),
  ('550e8400-e29b-41d4-a716-000000000009'::uuid, 'Hurlinghum-Shell(CAB 5)'),
  ('550e8400-e29b-41d4-a716-000000000010'::uuid, 'James Gichuru'),
  ('550e8400-e29b-41d4-a716-000000000011'::uuid, 'Kasuku center-kileleshwa'),
  ('550e8400-e29b-41d4-a716-000000000012'::uuid, 'Kirichwa-Ngaira Region'),
  ('550e8400-e29b-41d4-a716-000000000013'::uuid, 'Kitanga Rd-Muthangari Rd'),
  ('550e8400-e29b-41d4-a716-000000000014'::uuid, 'Lavington security(Cab 15)'),
  ('550e8400-e29b-41d4-a716-000000000015'::uuid, 'Lenana -Woodlands'),
  ('550e8400-e29b-41d4-a716-000000000016'::uuid, 'Lenana-Chaka'),
  ('550e8400-e29b-41d4-a716-000000000017'::uuid, 'Lenana-Rose Avenue(Cab 1)'),
  ('550e8400-e29b-41d4-a716-000000000018'::uuid, 'Mbaazi-Kingara Rd'),
  ('550e8400-e29b-41d4-a716-000000000019'::uuid, 'Mbaazi-Kunde Road'),
  ('550e8400-e29b-41d4-a716-000000000020'::uuid, 'Methodist'),
  ('550e8400-e29b-41d4-a716-000000000021'::uuid, 'Msanduku')
ON CONFLICT DO NOTHING;

-- Insert splitters
INSERT INTO public.splitters (location_id, model, port, notes)
VALUES 
  -- Argwings kodhek-Elgeyo Marakwet (2)
  ('550e8400-e29b-41d4-a716-000000000001'::uuid, 'Adhouse C650', '3/4', ''),
  ('550e8400-e29b-41d4-a716-000000000001'::uuid, 'Adhouse C650', '9/5', ''),
  -- Chaka-Tigoni (3)
  ('550e8400-e29b-41d4-a716-000000000002'::uuid, 'Adhs 620 2', '1/2', ''),
  ('550e8400-e29b-41d4-a716-000000000002'::uuid, 'Adhs 650', '3/10', 'White tape'),
  ('550e8400-e29b-41d4-a716-000000000002'::uuid, 'Adhs 620 1', '1/15', 'light blue patch cord'),
  -- Dennis pritt - Woodlands (3)
  ('550e8400-e29b-41d4-a716-000000000003'::uuid, 'Adhs C650', '3/14', ''),
  ('550e8400-e29b-41d4-a716-000000000003'::uuid, 'Adhs C650', '4/7', ''),
  ('550e8400-e29b-41d4-a716-000000000003'::uuid, 'Adhs C620 2', '1/12', ''),
  -- Dennis Pritt-Citizen (Cab 17) (2)
  ('550e8400-e29b-41d4-a716-000000000004'::uuid, 'Adhs C620 1', '1/12', ''),
  ('550e8400-e29b-41d4-a716-000000000004'::uuid, 'Adhs C650', '3/15', ''),
  -- Dennis spritt-Nyangumi (2)
  ('550e8400-e29b-41d4-a716-000000000005'::uuid, 'Adhouse C650', '9/6', 'Thin patch cord'),
  ('550e8400-e29b-41d4-a716-000000000005'::uuid, 'Adhouse C650', '3/12', 'Yellow Patch cord'),
  -- Dhanjay (2)
  ('550e8400-e29b-41d4-a716-000000000006'::uuid, 'Adhouse C650', '1/1', 'Yellow Patch cord'),
  ('550e8400-e29b-41d4-a716-000000000006'::uuid, 'Adhouse C650', '4/11', 'Thin Patch cord'),
  -- Githunguri (2)
  ('550e8400-e29b-41d4-a716-000000000007'::uuid, 'Adhs C620 1', '2/2', ''),
  ('550e8400-e29b-41d4-a716-000000000007'::uuid, 'Adhs C620 1', '2/3', ''),
  -- Hendred Ave-White Knight Apt (2)
  ('550e8400-e29b-41d4-a716-000000000008'::uuid, 'Adhs C650', '4/4', ''),
  ('550e8400-e29b-41d4-a716-000000000008'::uuid, 'Adhs C650', '9/12', ''),
  -- Hurlinghum-Shell(CAB 5) (4)
  ('550e8400-e29b-41d4-a716-000000000009'::uuid, 'JT C650', '2/9', 'Thin patch cords'),
  ('550e8400-e29b-41d4-a716-000000000009'::uuid, 'Adhs C650', '3/16', 'green paints'),
  ('550e8400-e29b-41d4-a716-000000000009'::uuid, 'Adhs C620 1', '2/16', 'black tape'),
  ('550e8400-e29b-41d4-a716-000000000009'::uuid, 'Adhs C620 1', '1/8', 'yellow patch cord'),
  -- James Gichuru (2)
  ('550e8400-e29b-41d4-a716-000000000010'::uuid, 'Adhouse C650', '2/5', 'Yellow Patch cord'),
  ('550e8400-e29b-41d4-a716-000000000010'::uuid, 'Adhouse C620 1', '1/14', 'Thin Patch cord'),
  -- Kasuku center-kileleshwa (4)
  ('550e8400-e29b-41d4-a716-000000000011'::uuid, 'Adhs C650', '7/3', ''),
  ('550e8400-e29b-41d4-a716-000000000011'::uuid, 'Adhs C650', '4/8', ''),
  ('550e8400-e29b-41d4-a716-000000000011'::uuid, 'Adhs C650', '4/14', ''),
  ('550e8400-e29b-41d4-a716-000000000011'::uuid, 'Adhs C650', '2/12', ''),
  -- Kirichwa-Ngaira Region (2)
  ('550e8400-e29b-41d4-a716-000000000012'::uuid, 'Adhouse C650', '7/16', ''),
  ('550e8400-e29b-41d4-a716-000000000012'::uuid, 'Adhouse C650', '8/1', ''),
  -- Kitanga Rd-Muthangari Rd (4)
  ('550e8400-e29b-41d4-a716-000000000013'::uuid, 'Adhs C650', '8/11', ''),
  ('550e8400-e29b-41d4-a716-000000000013'::uuid, 'Adhs C650', '3/3', ''),
  ('550e8400-e29b-41d4-a716-000000000013'::uuid, 'Adhs C650', '1/2', ''),
  ('550e8400-e29b-41d4-a716-000000000013'::uuid, 'Adhs C620 2', '1/5', ''),
  -- Lavington security(Cab 15) (3)
  ('550e8400-e29b-41d4-a716-000000000014'::uuid, 'Adhs C650', '1/8', 'Black tape'),
  ('550e8400-e29b-41d4-a716-000000000014'::uuid, 'Adhs C650', '3/7', ''),
  ('550e8400-e29b-41d4-a716-000000000014'::uuid, 'Adhs C620 2', '1/9', ''),
  -- Lenana -Woodlands (2)
  ('550e8400-e29b-41d4-a716-000000000015'::uuid, 'Adhs C650', '7/14', ''),
  ('550e8400-e29b-41d4-a716-000000000015'::uuid, 'Adhs C620 2', '2/9', ''),
  -- Lenana-Chaka (3)
  ('550e8400-e29b-41d4-a716-000000000016'::uuid, 'Adhs 650', '8/15', ''),
  ('550e8400-e29b-41d4-a716-000000000016'::uuid, 'Adhs C650', '3/11', ''),
  ('550e8400-e29b-41d4-a716-000000000016'::uuid, 'Adhs C620 2', '2/2', 'Thin patch cord'),
  -- Lenana-Rose Avenue(Cab 1) (3)
  ('550e8400-e29b-41d4-a716-000000000017'::uuid, 'Adhs C650', '8/7', 'Black tape'),
  ('550e8400-e29b-41d4-a716-000000000017'::uuid, 'Adhs C620 2', '1/1', 'Thin patch cord'),
  ('550e8400-e29b-41d4-a716-000000000017'::uuid, 'Adhouse C650', '3/13', ''),
  -- Mbaazi-Kingara Rd (2)
  ('550e8400-e29b-41d4-a716-000000000018'::uuid, 'ADHOUSE C650', '7/9', ''),
  ('550e8400-e29b-41d4-a716-000000000018'::uuid, 'ADHOUSE C650', '7/5', ''),
  -- Mbaazi-Kunde Road (2)
  ('550e8400-e29b-41d4-a716-000000000019'::uuid, 'Adhs C650', '7/8', ''),
  ('550e8400-e29b-41d4-a716-000000000019'::uuid, 'Adhs C650', '4/6', ''),
  -- Methodist (5)
  ('550e8400-e29b-41d4-a716-000000000020'::uuid, 'Adhouse C650', '3/9', ''),
  ('550e8400-e29b-41d4-a716-000000000020'::uuid, 'Adhouse C650', '4/1', ''),
  ('550e8400-e29b-41d4-a716-000000000020'::uuid, 'Adhouse C650', '2/7', ''),
  ('550e8400-e29b-41d4-a716-000000000020'::uuid, 'Adhouse 620 2', '2/1', ''),
  ('550e8400-e29b-41d4-a716-000000000020'::uuid, 'Adhouse 620', '1/4', ''),
  -- Msanduku (3)
  ('550e8400-e29b-41d4-a716-000000000021'::uuid, 'Adhs C650', '4/5', ''),
  ('550e8400-e29b-41d4-a716-000000000021'::uuid, 'Adhs C650', '7/7', ''),
  ('550e8400-e29b-41d4-a716-000000000021'::uuid, 'ADHOUSE C620 2', '1/3', '')
ON CONFLICT DO NOTHING;
