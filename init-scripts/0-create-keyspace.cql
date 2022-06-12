CREATE KEYSPACE medic_1
  WITH REPLICATION = { 
   'class' : 'SimpleStrategy', 
   'replication_factor' : 2 
};

CREATE KEYSPACE medic_2
  WITH REPLICATION = { 
   'class' : 'SimpleStrategy', 
   'replication_factor' : 3
};