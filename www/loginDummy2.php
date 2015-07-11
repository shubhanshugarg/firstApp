<?php

//for initial login test
//echo "1";
$arr = array('a' => '1');



$contacts = array(
 'success' => true,
  'data'=> array(
    'feed'=>array(
        "title" => "Peter Parker",
        "description" => "peterparker@mail.com",
        "link" => "peterparker@mail.com",
        "entries" => array(
     					   'one'=>array("id"=>"1","title" => "Peter Parker","images"=>array('url1' => '4abeb948-d1ce-427c-9705-1128d29c3957' ),"publishedDate"=>"3/3/3","content"=>"bla bla bla","urlLink"=>"www.google.com","socialLink"=>"http://www.google.com","postedByRoll"=>"301/3/3","postedByName"=>"sam",
       					 "contentSnippet" => "peterparker@mail.com"
       					 ),'ne'=>array("title" => "Peter Parker",
       					 "contentSnippet" => "peterparker@mail.com"
       					 ),'oe'=>array("title" => "Peter Parker",
       					 "contentSnippet" => "peterparker@mail.com"
       					 ),'on'=>array("title" => "Peter Parker",
       					 "contentSnippet" => "peterparker@mail.com"
       					 ),'two'=>array("title" => "Peter Parker",
       					 "contentSnippet" => "peterparker@mail.com"
       					 ),'1'=>array("title" => "Peter Parker",
       					 "contentSnippet" => "peterparker@mail.com"
       					 ),'2'=>array("title" => "Peter Parker",
       					 "contentSnippet" => "peterparker@mail.com"
       					 ),'3'=>array("title" => "Peter Parker",
       					 "contentSnippet" => "peterparker@mail.com"
       					 )
    				)
    )
),
'message' => 'message sent'
);


//for button login test
//{"employees":[{"firstName":"John","lastName":"Doe"},{"firstName":"Anna","lastName":"Smith"},{"firstName":"Peter","lastName":"Jones"}]}
print_r(json_encode($contacts)) ;
//return true;