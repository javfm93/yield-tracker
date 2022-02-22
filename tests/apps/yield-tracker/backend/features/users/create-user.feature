Feature: Create a new user
  In order to have users in the application
  As a new user
  I want to register myself with my wallet

  Scenario: A valid not existent user
    Given I send a PUT request to "/users/ef8ac118-8d7f-49cc-abec-78e0d05af80a" with body:
    """
    {
      "address": "0x7C694bAA67Ec0A102f21587b87864621ADc81c2c"
    }
    """
    Then the response status code should be 201
    And the response should be empty
