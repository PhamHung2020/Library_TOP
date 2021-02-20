document.querySelector('.add-button').addEventListener('click', () => 
{
    const form_wrapper = document.querySelector('.form-wrapper');
    form_wrapper.classList.remove('display-none');
})

document.querySelector('#cancel').addEventListener('click', () => 
{
    const form_wrapper = document.querySelector('.form-wrapper');
    form_wrapper.classList.add('display-none');
})