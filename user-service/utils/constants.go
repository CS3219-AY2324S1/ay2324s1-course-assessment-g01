package utils

const (
	UserLoggedIn         string = "User has logged in successfully"
	LogInError           string = "Error occurred in logging user in"
	UserLoggedOut        string = "User has logged out successfully"
	UserNotFound         string = "User is not found"
	IncorrectPassword    string = "Password is incorrect"
	IncorrectOldPassword string = "Old password is incorrect"
	PasswordChanged      string = "Password is changed"
	PasswordTooShort     string = "Password is too short"
	NameTooShort         string = "Name is too short"
	NameChanged          string = "User name is changed"
	InvalidEmail         string = "Invalid email address"
	InvalidId            string = "Invalid id"
	GetError             string = "Error occured when fetching result"
	CreateError          string = "Error occured when creating record"
	UpdateError          string = "Error occured when updating record"
	DeleteError          string = "Error occured when deleting record"
	DeleteSuccess        string = "Record has been deleted successfully"
	ForbiddenAction      string = "User cannot perform this operation"
	Success              string = "Operation success"
	RecordNotFound       string = "No record is found"
	DuplicateRecord      string = "Record already exists"
	MinPasswordLength    int    = 6
	MinNameLength        int    = 3
)
