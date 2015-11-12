<?php

//for initial login test
//echo "1";
$arr = array('a' => '1');



$contacts = array(
 'success' => true,
  'data'=> array(
    '0'=>array(
        "userName" => "Peter Parker",
        "rollNumber" => "11111"
        
    )
),
'message' => 'message sent'
);


//for button login test
//{"employees":[{"firstName":"John","lastName":"Doe"},{"firstName":"Anna","lastName":"Smith"},{"firstName":"Peter","lastName":"Jones"}]}
print_r(json_encode($contacts)) ;
//return true;