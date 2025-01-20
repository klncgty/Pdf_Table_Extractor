import os
import pandas as pd
from pandasai import Agent

def ask_question(question, table_data):
    try:
        if not isinstance(table_data, list):
            table_data = [table_data]
            
        df = pd.DataFrame(table_data)
        df.columns = ['_'.join(filter(None, map(str, col))) for col in df.columns]
        for col in df.columns:
            if df[col].dtype == 'object':  
                try:
                    df[col] = df[col].str.replace(',', '.').astype(float)
                except ValueError:
                    pass
    

        
        os.environ["PANDASAI_API_KEY"] = "$2a$10$rBCCww6/tzHJbS.LxkKvNu6IStPbiuoY03k4Y8LX75CtDTgQHaMBu"
        agent = Agent(df)
        
        
        response = agent.chat(str(question))  
        print(df)
        return str(response)
    except Exception as e:
        return f"Error processing question: {str(e)}"
