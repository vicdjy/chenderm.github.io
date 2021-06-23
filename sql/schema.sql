CREATE TABLE export
(
    sessionid VARCHAR(45) NOT NULL,
    accesstime TIMESTAMP NOT NULL,
    yaxis VARCHAR(20),
    locationdata VARCHAR(20),
    lowdate VARCHAR(20),
    highdate VARCHAR(20),
    graphtype VARCHAR(20),
    color VARCHAR(20),
    drivingQuestion VARCHAR(45),
    isDropDown INTEGER,
    hasNotes INTEGER,
    scriptSeen INTEGER,
    savedGraphNum INTEGER,
    exportNum INTEGER
);

--scriptSeen is 1 if saved graph is clicked to see JSON
--scriptSeen is -1 if saved graph is deleted

INSERT INTO export
            (sessionid,
             accesstime,
             yaxis,
             locationdata,
             lowdate,
             highdate,
             graphtype,
             color,
             drivingquestion,
             isdropdown,
             hasnotes,
             scriptseen,
             savedgraphnum, 
             exportNum)
VALUES      (9492022,
             '2008-01-01 00:00:01',
             'Population',
             'Rwanda',
             '1870',
             '1940',
             'bar',
             'red',
             'Is land area related to population growth?',
             1,
             1,
             1,
             1,
             1); 
-- DROP TABLE export;