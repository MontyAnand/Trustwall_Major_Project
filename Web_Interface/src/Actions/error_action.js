

export const errorAction = (error_type, error_object) => {
    return {
        type: error_type,
        payload: {
            type: error_type,
            payload: error_object,
        },
    }
}