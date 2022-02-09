CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author VARCHAR,
    url VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    likes INT DEFAULT 0
);

insert into blogs (author, url, title) values ('joe joel', 'www.joe.dev', 'make your blog');
insert into blogs (author, url, title) values ('john smith', 'www.johnsmith.dev', 'practice sequelize');

select * from blogs;