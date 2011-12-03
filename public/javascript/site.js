/// plugins/extensions

_.mixin({
    /*  as_text : Normalise text values of the of the json from IATI
    
    The reason this can be an issue is that converting the xml to json:
    
    <title>The Title</title>
        ->  {title:'The Title'}
    
    <title xml:lang="en">The Title</title> 
        ->  {title:{"@xml:lang":"en", "#text":'The Title'}}
    
    calling `_.to_s({…the object…})` will return the whichever value is available
    */
    as_text:function(node){
        return node['#text'] || node;
    },
    
    
    /* as_array : Normalise an array of elements from the IATI json
    
    The reason for this is:
    
    <list><item>value1</item><item>value2</item></list>
        -> {list:[{item:value1},{item:value2}]}
    
    <list><item>value</item></list>
        -> {list:{item:value}}
    
    if there is a single item, then the json converter doesn't (and can't)
    infer that the item was meant to be in a array
    
    calling `_.to_a(the_object_or_array)` will always return the data as an
    array (unless the object is undefined, in which case undefined will return)
    
    */
    
    as_array: function(nodes){
      return nodes === undefined ? undefined :
               (_.isArray(nodes) ? nodes : [nodes]);
    }
    
    
    
});