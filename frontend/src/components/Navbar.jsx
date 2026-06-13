function Navbar(props){
    return(
        <div className="navbar">
            <h1>{props.title}</h1>
            <p> Convert your audio recordings into guitar tabs</p>
        </div>
    )
}

export default Navbar;