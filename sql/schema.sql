CREATE TABLE script
(
    sessionid VARCHAR(45) NOT NULL,
    accesstime TIMESTAMP NOT NULL,
    yaxis VARCHAR(20),
    locationdata VARCHAR(20),
    lowdate VARCHAR(20),
    highdate VARCHAR(20),
    graphtype VARCHAR(20),
    color VARCHAR(20),
    graphNum INTEGER,
    actionItem VARCHAR(20)
);

--scriptSeen is 1 if saved graph is clicked to see JSON
--scriptSeen is -1 if saved graph is deleted
