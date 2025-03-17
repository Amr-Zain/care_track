function Input({ type, placeholder, register,error, ...rest}) {
    return ( <div>
                <input
                    type={type}
                    placeholder={placeholder}
                    {...register}
                    {...rest}
                />
                {error && <span className="error-message">{error.message}</span>}
            </div> );
}

export default Input;