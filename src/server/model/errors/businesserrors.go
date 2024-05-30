package StudyBuddyErrors

// General Errors
const (
	Unauthorized   = "Unauthorized"
	InvalidSession = "Current session is invalid"
	ServerError    = "Something went wrong on the server, try again later."
)

// Group Errors
const (
	NotMember     = "Not a member of the group"
	AlreadyMember = "Already a member of the group"
	SelfDMError   = "Cannot send direct message to self"
)

// Account Errors
const (
	InvalidCredentials = "Invalid email or password"
	ExistingEmail      = "An account with that email already exists"
	InvalidResetToken  = "Invalid reset token"
)

// Message Errors
const (
	MessageOrFileRequired = "Message or file is required"
)
