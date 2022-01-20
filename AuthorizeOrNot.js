
const AuthorizeOrNot = (props) => {
    return (
        <>
            {props.access_token
                ? <div class="alert alert-success">
                    <strong>Viola!</strong> You are authorized.
                </div>
                : <div class="alert alert-danger">
                <strong>Ohh!</strong> You are not authorized. Refresh if you have authorised. Otherwise click on Authorize Access.
            </div>
            }
        </>
    );
}

export default AuthorizeOrNot;