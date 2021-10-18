create table towns (
townId serial primary key, 
town text not null, 
reg_code text not null
);

INSERT INTO towns (town,reg_code) VALUES ('Cape Town','CA');
INSERT INTO towns (town,reg_code) VALUES ('Paarl','CJ');
INSERT INTO towns (town,reg_code) VALUES ('Malmesbury','CK');

create table regNumbers (
id serial primary key, 
reg_numbers text not null,
town_id int,
foreign key (town_id) references towns(townId)
 );