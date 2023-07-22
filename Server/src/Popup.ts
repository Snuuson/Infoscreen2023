let popup = <HTMLDivElement>document.createElement(`div`);
let timeout;
const showPopup = (text: string, timeInSeconds: number) => {
    clearTimeout(timeout);
    popup.innerHTML = text;
    popup.classList.add('show');
    popup.classList.remove('hide');
    timeout = setTimeout(() => {
        popup.classList.remove('show');
        popup.classList.add('hide');
    }, timeInSeconds * 1000);
};
popup.setAttribute('class', 'popup');
popup.innerHTML = 'SAVED!';
addEventListener('DOMContentLoaded', (event) => {
    document.getElementsByTagName('body')[0].appendChild(popup);
});

export { showPopup };
