CREATE TABLE export
(
    sessionid VARCHAR(45) NOT NULL,
    accesstime TIMESTAMP NOT NULL,
    yaxis VARCHAR(20) NOT NULL,
    locationdata VARCHAR(20) NOT NULL,
    lowdate VARCHAR(20) NOT NULL,
    highdate VARCHAR(20) NOT NULL,
    graphtype VARCHAR(20) NOT NULL,
    color VARCHAR(20) NOT NULL,
    drivingQuestion VARCHAR(45) NOT NULL,
    isDropDown INTEGER NOT NULL,
    hasNotes INTEGER NOT NULL,
    scriptSeen INTEGER NOT NULL,
    savedGraphNum INTEGER
);


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
             savedgraphnum)
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
             1); 
-- DROP TABLE export;