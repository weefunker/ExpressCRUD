$(document).ready(function(){
    $('.deleteUser').on('click', deleteUser);
});

function deleteUser(){
    var confirmation = confirm('Are you sure you wanna delete?');

    if(confirmation){
        $.ajax({
            type: 'DELETE',
            url: '/users/delete/'+$('.deleteUser').data('id')
        }).done(function(response){
            window.location.replace('/');
        });
    } else {
        return false;
    }
}