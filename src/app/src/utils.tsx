import { useParams } from "react-router-dom";

function withParams(Component: unknown) {
    // @ts-ignore
    return (props: unknown) => <Component {...props} params={useParams()} />;
}

function getRandomOfList (list: Array<string>) {
    return list[Math.floor((Math.random()*list.length))];
}

export { getRandomOfList, withParams };