CREATE TABLE export
(
    sessionid VARCHAR(45) NOT NULL,
    accesstime TIMESTAMP NOT NULL,
    yaxis VARCHAR(20) NOT NULL,
    locationdata VARCHAR(20) NOT NULL,
    lowdate VARCHAR(20) NOT NULL,
    highdate VARCHAR(20) NOT NULL,
    graphtype VARCHAR(20) NOT NULL,
    color VARCHAR(20) NOT NULL
);

INSERT INTO export
    (sessionid,accesstime,yaxis,locationdata,lowdate,highdate,graphtype,color)
VALUES
    (9492022, '2008-01-01 00:00:01', 'Population', 'Rwanda', '1870', '1940', 'bar', 'red');


-- DROP TABLE export;