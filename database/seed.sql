USE pythonpro;
INSERT INTO achievements(id,title,payload) VALUES
('first-lesson','First Lesson',JSON_OBJECT('threshold',1,'metric','lessons')),
('questions-100','100 Questions',JSON_OBJECT('threshold',100,'metric','questions')),
('coding-10','10 Coding Problems',JSON_OBJECT('threshold',10,'metric','coding')),
('first-project','First Project',JSON_OBJECT('threshold',1,'metric','projects')),
('streak-7','7-Day Streak',JSON_OBJECT('threshold',7,'metric','streak'));
