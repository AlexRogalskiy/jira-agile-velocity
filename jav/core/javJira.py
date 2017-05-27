import requests

class Jira(object):
    ''' 
        Handle connection to JIRA
    '''

    def __init__(self, log, config):
        self.log = log
        self.config = config

    def getCompletedTickets(self, date_current):
        self.log.info('Jira.getCompletedTickets(): Getting completed tickets from Jira for date: ' + date_current.strftime("%Y-%m-%d"))
        return self.call(self.config.get_config_value('jira_jql_velocity') + ' during(\"' + date_current.strftime("%Y-%m-%d") + '\", \"' + date_current.strftime("%Y-%m-%d") + '\")')

    def getRemainingTickets(self):
        self.log.info('Jira.getTickets(): Getting remaining tickets from Jira')
        return self.call(self.config.get_config_value('jira_jql_remaining'))

    def call(self, jql_query):
        headers = {
            "Content-Type": "application/json",
        }
        params = (
            ("jql", jql_query),
        )
        try:
            tickets = requests.get(self.config.get_config_value('jira_host') + "/rest/api/2/search", headers=headers,
                                   params=params,
                                   auth=(
                                   self.config.get_config_value('jira_username'), self.config.get_config_value('jira_password')))
        except Exception as ex:
            #ConnectionError
            template = "An exception of type {0} occurred. Arguments:\n{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            self.log.error('Jira.call(): Unable to communicate with remote JIRA server, exiting... ')
            self.log.error(message)
            exit()

        return tickets
