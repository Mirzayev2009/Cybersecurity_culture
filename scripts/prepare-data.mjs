import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('src/lib/cyberculture.js', 'utf8');
const declarations = source.slice(source.indexOf('const B='), source.indexOf('const STORAGE='));
const context = {};
vm.runInNewContext(`${declarations}\nglobalThis.answerKey=EXAM.map(x=>x.a)`, context);
fs.writeFileSync('data/answer-key.json', JSON.stringify(context.answerKey));

const raw = JSON.parse(fs.readFileSync('data/uzbekistan-schools-source.json', 'utf8'));
const regionNames = [...new Set(raw.map((x) => x.viloyat.trim()))].sort();
const regions = regionNames.map((name, index) => ({ id: index + 1, name }));
const districts = [];
const schools = [];
for (const region of regions) {
  const districtNames = [...new Set(raw.filter((x) => x.viloyat.trim() === region.name).map((x) => x.tuman.trim()))].sort();
  for (const name of districtNames) {
    const district = { id: districts.length + 1, regionId: region.id, name };
    districts.push(district);
    const schoolNames = [...new Set(raw.filter((x) => x.viloyat.trim() === region.name && x.tuman.trim() === name).map((x) => x.maktab.trim()))].sort();
    for (const schoolName of schoolNames) schools.push({ id: schools.length + 1, districtId: district.id, name: schoolName });
  }
}
const directory = { regions, districts, schools };
fs.writeFileSync('data/uzbekistan-schools.json', JSON.stringify(directory));
fs.writeFileSync('public/uzbekistan-schools.json', JSON.stringify(directory));

const quote = (value) => `'${String(value).replaceAll("'", "''")}'`;
let sql = `-- SECOND THOUGHT registration and Uzbekistan school directory.
-- Community directory: https://github.com/Asadbek525/schools_list
-- Review coverage and spelling before launch.

create table if not exists public.regions (id integer primary key, name text not null unique);
create table if not exists public.districts (id integer primary key, region_id integer not null references public.regions(id), name text not null, unique(region_id,name));
create table if not exists public.schools (id integer primary key, district_id integer not null references public.districts(id), name text not null, unique(district_id,name));
create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  region_id integer not null references public.regions(id),
  district_id integer not null references public.districts(id),
  school_id integer not null references public.schools(id),
  class_name text not null check (char_length(class_name) between 1 and 20),
  first_name text not null check (char_length(first_name) between 1 and 80),
  last_name text not null check (char_length(last_name) between 1 and 80),
  score smallint not null check (score between 16 and 20),
  created_at timestamptz not null default now()
);
create index if not exists registrations_school_id_idx on public.registrations(school_id);
create index if not exists registrations_created_at_idx on public.registrations(created_at);
alter table public.regions enable row level security;
alter table public.districts enable row level security;
alter table public.schools enable row level security;
alter table public.registrations enable row level security;
revoke all on public.regions, public.districts, public.schools, public.registrations from anon, authenticated;
-- Server-only secret key writes registrations; no browser read policy.

`;
for (const [table, items, fields] of [
  ['regions', regions, ['id', 'name']],
  ['districts', districts, ['id', 'region_id', 'name']],
  ['schools', schools, ['id', 'district_id', 'name']],
]) {
  for (let i = 0; i < items.length; i += 300) {
    const batch = items.slice(i, i + 300);
    sql += `insert into public.${table} (${fields.join(', ')}) values\n`;
    sql += batch.map((item) => `(${fields.map((field) => quote(field === 'region_id' ? item.regionId : field === 'district_id' ? item.districtId : item[field])).join(', ')})`).join(',\n');
    sql += '\non conflict do nothing;\n';
  }
}
fs.writeFileSync('supabase-setup.sql', sql);
console.log({ regions: regions.length, districts: districts.length, schools: schools.length, questions: context.answerKey.length });
